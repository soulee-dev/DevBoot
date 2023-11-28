FROM ubuntu

RUN apt-get update \
	&& apt-get install -y \
	curl \
	git \
	python3.10 \
	python3.10-venv \
	mysql-server \
	mysql-client \
	sudo \
	vim \
	wget \
	&& rm -rf /var/lib/apt/lists/*

ARG USER=coder
RUN useradd --groups sudo --no-create-home --shell /bin/bash ${USER} \
	&& echo "${USER} ALL=(ALL) NOPASSWD:ALL" >/etc/sudoers.d/${USER} \
	&& chmod 0440 /etc/sudoers.d/${USER}
USER ${USER}
WORKDIR /home/${USER}

# Install MySQL
COPY setup.sh .
RUN chmod +x setup.sh

# Install Python MySQL Replication
RUN git clone https://github.com/julien-duponchelle/python-mysql-replication \
	&& cd python-mysql-replication \
	&& python3 -m venv venv \
	&& . venv/bin/activate \
	&& pip install . \
	&& pip install packaging \
	&& pip install pytest
